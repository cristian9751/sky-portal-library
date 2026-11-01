import { useEffect, useRef, useState, type FormEvent } from "react";
import { COUNTRIES } from "@/data/countries";
import { useApplicationContext, type UserProps } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

export type DashboardUserEditValues = {
  name: string;
  surname: string;
  email: string;
  countryID: string;
};

type DashboardUserEditProps = {
  onSubmit: (values: DashboardUserEditValues) => void | Promise<void>;
};

const getProfileValues = (user?: UserProps): DashboardUserEditValues => ({
  name: user?.name ?? "",
  surname: user?.surname ?? "",
  email: user?.email ?? "",
  countryID: user?.countryID ?? "",
});

export function DashboardUserEdit({ onSubmit }: DashboardUserEditProps) {
  const { user } = useApplicationContext();
  const { t } = useI18n();
  const [values, setValues] = useState(() => getProfileValues(user));
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    setValues(getProfileValues(user));
  }, [user]);

  const updateField = (field: keyof DashboardUserEditValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setIsSaved(false);
    setSubmitError("");
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setIsSaved(false);
    setSubmitError("");

    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        surname: values.surname.trim(),
        email: values.email.trim(),
      });
      setIsSaved(true);
    } catch (error) {
      setSubmitError(error instanceof Error && error.message ? error.message : t.errors.connectionIssue);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="alert alert-info" role="status">
        {t.user.profileNoUser}
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card card-primary card-outline">
          <div className="card-header">
            <h2 className="card-title">{t.dashboard.profile}</h2>
          </div>
          <form onSubmit={saveProfile} aria-busy={isSubmitting}>
            <div className="card-body">
              <fieldset className="row g-3 border-0 p-0" disabled={isSubmitting}>
                <div className="col-md-6">
                  <label htmlFor="profile-name" className="form-label">
                    {t.auth.first}
                  </label>
                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    className="form-control"
                    autoComplete="given-name"
                    value={values.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="profile-surname" className="form-label">
                    {t.auth.last}
                  </label>
                  <input
                    id="profile-surname"
                    name="surname"
                    type="text"
                    className="form-control"
                    autoComplete="family-name"
                    value={values.surname}
                    onChange={(event) => updateField("surname", event.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="profile-email" className="form-label">
                    {t.auth.email}
                  </label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    className="form-control"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="profile-country" className="form-label">
                    {t.auth.country}
                  </label>
                  <select
                    id="profile-country"
                    name="countryID"
                    className="form-select"
                    value={values.countryID}
                    onChange={(event) => updateField("countryID", event.target.value)}
                  >
                    <option value="">—</option>
                    {COUNTRIES.map(([value, name]) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
              {submitError && (
                <p className="alert alert-danger mt-3 mb-0" role="alert">
                  {submitError}
                </p>
              )}
              {isSaved && (
                <p className="mt-3 mb-0 text-success" role="status">
                  {t.user.profileUpdated}
                </p>
              )}
            </div>
            <div className="card-footer">
              {isSubmitting ? (
                <div className="d-flex align-items-center gap-2" role="status">
                  <Skeleton className="h-10 w-36" />
                  <span>{t.user.profileSaving}</span>
                </div>
              ) : (
                <button type="submit" className="btn btn-primary">
                  {t.user.profileSave}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
