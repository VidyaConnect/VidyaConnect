"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as api from "../services/school-requests.service";
import type { DecisionInput, SchoolRequest, SchoolType, StatusFilter } from "../types/school-request.types";

export function useSchoolRequests() {
  const [requests, setRequests] = useState<SchoolRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState<"all" | SchoolType>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRequests(await api.getRequests());
    } catch {
      setError("We couldn't load school requests. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replace = (updated: SchoolRequest) =>
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: requests.length, pending: 0, under_review: 0, needs_info: 0, approved: 0, rejected: 0 };
    requests.forEach((r) => c[r.status]++);
    return c;
  }, [requests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests
      .filter((r) => status === "all" || r.status === status)
      .filter((r) => type === "all" || r.type === type)
      .filter((r) =>
        !q || [r.schoolName, r.adminName, r.adminEmail, r.registrationNumber, r.id].some((v) => v.toLowerCase().includes(q)),
      )
      .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
  }, [requests, search, status, type]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = (iso?: string) => !!iso && new Date(iso).getMonth() === now.getMonth() && new Date(iso).getFullYear() === now.getFullYear();
    const decided = requests.filter((r) => r.decidedAt);
    const avgHours = decided.length
      ? Math.round(decided.reduce((s, r) => s + (+new Date(r.decidedAt!) - +new Date(r.submittedAt)), 0) / decided.length / 3_600_000)
      : 0;
    return {
      awaiting: counts.pending + counts.under_review,
      approvedThisMonth: requests.filter((r) => r.status === "approved" && thisMonth(r.decidedAt)).length,
      rejectedThisMonth: requests.filter((r) => r.status === "rejected" && thisMonth(r.decidedAt)).length,
      avgHours,
    };
  }, [requests, counts]);

  const startReview = async (id: string) => replace(await api.startReview(id));
  const decide = async (id: string, input: DecisionInput) => replace(await api.decideRequest(id, input));
  const addNote = async (id: string, text: string) => replace(await api.addNote(id, text));

  return { requests, filtered, loading, error, reload: load, counts, stats, search, setSearch, status, setStatus, type, setType, startReview, decide, addNote };
}
