ALTER TABLE "school_user"."users" ADD COLUMN "department" TEXT;

ALTER TABLE "school_user"."teachers"
  ADD COLUMN "qualification" TEXT,
  ADD COLUMN "subjects" TEXT,
  ADD COLUMN "experienceYears" INTEGER,
  ADD COLUMN "classroom" TEXT;
  