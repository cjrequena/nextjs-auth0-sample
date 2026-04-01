import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4">
      <div className="card bg-base-200 shadow-lg w-full max-w-sm">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">Sign Up</h2>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Full Name" className="input input-bordered w-full" />
            <input type="email" placeholder="Email" className="input input-bordered w-full" />
            <input type="password" placeholder="Password" className="input input-bordered w-full" />
            <button type="submit" className="btn btn-primary w-full">Create Account</button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/signin" className="link link-primary">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
