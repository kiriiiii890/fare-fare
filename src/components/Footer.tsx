import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-background-alt py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <Image
          src={withBasePath("/images/logo/main-logo.png")}
          alt="FAYE"
          width={200}
          height={244}
          className="h-10 w-auto opacity-90"
        />
        <p className="font-body text-xs tracking-wide text-muted">
          © {new Date().getFullYear()} FAYE. Đã đăng ký bản quyền.
        </p>
      </div>
    </footer>
  );
}
