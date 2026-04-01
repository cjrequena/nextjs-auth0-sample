import { getSession } from "@/lib/get-session";
import { getRoles, getPermissions } from "@/lib/rbac";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const { user } = session;
  const roles = getRoles(user);
  const permissions = getPermissions(user);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="card bg-base-200 shadow-lg mb-6">
        <div className="card-body">
          <h2 className="card-title">Profile</h2>
          <div className="flex items-center gap-4 mt-2">
            {user.picture && (
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <img src={user.picture} alt={user.name || "Avatar"} />
                </div>
              </div>
            )}
            <div>
              <p className="font-semibold">{user.name || user.nickname}</p>
              <p className="text-sm opacity-70">{user.email}</p>
              {user.email_verified === false && (
                <span className="badge badge-warning badge-sm mt-1">Email not verified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {roles.length > 0 && (
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title">Roles</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {roles.map((role) => (
                <span key={role} className="badge badge-primary">{role}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {permissions.length > 0 && (
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title">Permissions</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {permissions.map((perm) => (
                <span key={perm} className="badge badge-secondary">{perm}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Session Details</h2>
          <pre className="text-xs overflow-auto mt-2 p-3 bg-base-300 rounded-lg max-h-64">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
