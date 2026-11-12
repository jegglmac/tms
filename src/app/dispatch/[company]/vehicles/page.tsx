import { RosterPage, type RosterPageProps } from "../../roster-page";

export default function Page(props: RosterPageProps) {
  return <RosterPage kind="vehicles" {...props} />;
}
