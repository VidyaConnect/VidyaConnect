CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL,
  student_id UUID NOT NULL,
  class_id UUID NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  reason TEXT,
  marked_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);