// Read-only consent numbers for the School Admin reports page.
import prisma from "../lib/prisma.js";

const MAX_FORMS = 8;

async function schoolIdFor(user) {
  const [profile] = await prisma.$queryRaw`
    SELECT "schoolId" FROM school_user.users
    WHERE "keycloakId" = ${user.userId} AND "isActive" = true
    LIMIT 1
  `;
  return profile?.schoolId ?? user.schoolId ?? null;
}

export async function getSchoolConsentSummary(user) {
  const schoolId = await schoolIdFor(user);
  if (!schoolId) {
    const err = new Error("This account is not linked to a school");
    err.statusCode = 403;
    throw err;
  }

  // Only forms that were published (ACTIVE or CLOSED). Drafts have no responses yet.
  const forms = await prisma.consentForm.findMany({
    where: { schoolId, status: { in: ["ACTIVE", "CLOSED"] } },
    include: { recipients: { select: { status: true } } },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  let recipients = 0;
  let responded = 0;

  const perForm = forms.map((f) => {
    const total = f.recipients.length;
    const submitted = f.recipients.filter((r) => r.status !== null).length;
    const waiting = total - submitted;
    const overdue = f.deadline <= now ? waiting : 0;
    recipients += total;
    responded += submitted;
    return {
      form: f.title,
      submitted,
      pending: waiting - overdue,
      overdue,
    };
  });

  return {
    responseRate: recipients === 0 ? null : Math.round((responded / recipients) * 100),
    openForms: forms.filter((f) => f.status === "ACTIVE" && f.deadline > now).length,
    forms: perForm.slice(0, MAX_FORMS),
  };
}
