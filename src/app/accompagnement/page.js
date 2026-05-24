import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Accompagnement - Aurora',
  description: 'Discover our accompaniment services for luxury outdoor hospitality.',
};

/** Live CMS has no accompagnement payload — route forwards to agency page. */
export default function AccompagnementPage() {
  redirect('/agence');
}
