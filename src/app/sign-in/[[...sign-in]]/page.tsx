import SignInForm from "./MultiFactore";

export default function Page() {
  return (
    <div className="flex justify-center py-24">
      {/*<SignIn signUpForceRedirectUrl={"/dashboard"} />*/}
      <SignInForm />
    </div>
  );
}
