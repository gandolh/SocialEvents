import Card from "@/components/Shared/atoms/Card";
import LoginHeader from "@/components/Authentication/molecules/LoginHeader";
import LoginForm from "@/components/Authentication/molecules/LoginForm";
import AuthBackground from "@/components/Calendar/atoms/AuthBackground";

export default function Component() {

  return (
    <>
      <AuthBackground >
        <div className="grid w-full h-screen bg-no-repeat bg-cover" style={{ gridTemplateColumns: '4fr 1fr 1fr' }}>
          <div></div>
          <Card className="justify-center bg-white px-8 rounded-none" color="transparent" shadow={false}>
            <LoginHeader />
            <LoginForm />
          </Card>
          <div></div>
        </div>
      </AuthBackground>
    </>
  )
}