import { render } from "@react-email/render";
import { Email } from "@/components/email";

export default function EmailPreview({ brandKit }) {
  const emailHtml = render(<Email brandKit={brandKit} />);

  return (
    <div className="w-full h-full bg-white">
      <iframe srcDoc={emailHtml} className="w-full h-full border-none" />
    </div>
  );
}
