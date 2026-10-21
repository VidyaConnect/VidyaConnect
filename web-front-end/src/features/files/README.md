# Shared file storage for feature pages

`src/features/files` owns the browser-side integration with File Service. It can be reused by any authenticated feature page for PDFs, images, and other files.

## Add an upload/download field to a page

```tsx
import FileField from "@/features/files/components/FileField";

<FileField
  purpose="announcement_attachment"
  accept=".pdf,.png,.jpg,.jpeg"
  maxFileSizeBytes={10 * 1024 * 1024}
  fileId={attachment?.fileId}
  fileName={attachment?.fileName}
  onChange={setAttachment}
/>
```

When the form is saved, send the returned `fileId` to that feature's API and persist the ID with the business record. To render a download action separately, use `FileDownload` with the stored ID and display name. The helper `uploadFile` and API functions in `services/fileApi.ts` are available when a page needs a custom UI.

For an image field such as a school logo or profile photo, use `FileUpload` to save the returned ID and `FileImage` to render it:

```tsx
import FileImage from "@/features/files/components/FileImage";

{schoolLogoFileId && <FileImage fileId={schoolLogoFileId} alt="School logo" className="h-16 w-16 object-contain" />}
```

## Important integration rules

- Each feature must persist its file ID and associate it with the correct record. Uploading a file does not automatically attach it to an announcement, profile, registration, or other record.
- Feature APIs should validate that the file is `COMPLETED` and belongs to the record's school before saving the association.
- Downloads are authorized by File Service and return a short-lived signed URL. Do not store signed URLs; store file IDs.
- Public onboarding flows without an authenticated school context need a separate staging/approval design. Do not weaken File Service authorization to make those flows work.
- Use a purpose value such as `announcement_attachment`, `school_logo`, or `verification_document` to make the use case searchable.
- The API limits uploads to 25 MiB. Set a smaller page-specific `maxFileSizeBytes` when the form requires it.

## Current demo branch scope

The file-storage branch contains the generic API and reusable controls. Existing demo pages must be wired to persist file IDs through their own APIs before those screens use central storage. In particular, the school verification form is currently an unauthenticated multipart registration flow, and the announcement backend currently does not persist the file ID supplied by its UI model.
