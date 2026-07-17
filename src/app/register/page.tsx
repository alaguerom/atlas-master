import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Reg&iacute;strate para comenzar tu aventura."
    >
      <RegisterForm />
    </AuthLayout>
  );
}