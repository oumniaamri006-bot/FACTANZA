import { birthYears, genders, occupations, referrals, regions } from "@/data/profile-options";
import type { UserState } from "@/lib/factanza-state";

export type AboutYou = Pick<
  UserState,
  "birthYear" | "region" | "occupation" | "gender" | "referral"
>;

function Choice({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null;
  options: (string | number)[];
  placeholder: string;
  onChange: (value: string | null) => void;
}) {
  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Campi "Parlaci di te": anno di nascita (richiesto), poi dati facoltativi. */
export function AboutYouFields({
  value,
  onChange,
  idPrefix,
}: {
  value: AboutYou;
  onChange: (patch: Partial<AboutYou>) => void;
  idPrefix: string;
}) {
  return (
    <div className="auth-form">
      <Choice
        id={`${idPrefix}-birth`}
        label="Anno di nascita"
        value={value.birthYear === null ? null : String(value.birthYear)}
        options={birthYears}
        placeholder="Scegli l’anno"
        onChange={(year) => onChange({ birthYear: year ? Number(year) : null })}
      />
      <Choice
        id={`${idPrefix}-region`}
        label="Dove vivi"
        value={value.region}
        options={regions}
        placeholder="Regione (facoltativo)"
        onChange={(region) => onChange({ region })}
      />
      <Choice
        id={`${idPrefix}-occupation`}
        label="Cosa fai"
        value={value.occupation}
        options={occupations}
        placeholder="Facoltativo"
        onChange={(occupation) => onChange({ occupation })}
      />
      <Choice
        id={`${idPrefix}-gender`}
        label="Genere"
        value={value.gender}
        options={genders}
        placeholder="Facoltativo"
        onChange={(gender) => onChange({ gender })}
      />
      <Choice
        id={`${idPrefix}-referral`}
        label="Come ci hai conosciuto"
        value={value.referral}
        options={referrals}
        placeholder="Facoltativo"
        onChange={(referral) => onChange({ referral })}
      />
    </div>
  );
}
