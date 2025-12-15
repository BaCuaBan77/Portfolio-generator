import { readPortfolioConfig, readProjectsConfig } from '@/lib/config';
import DefaultPage from '@/app/layouts/Default/DefaultPage';
import AestheticPage from '@/app/layouts/Aesthetic/AestheticPage';

// Force dynamic rendering to ensure config files are read fresh on each request
export const dynamic = 'force-dynamic';

export default async function Home() {
  const portfolio = await readPortfolioConfig();
  const projects = await readProjectsConfig();
  // Use PORTFOLIO_STYLE to select which layout to render
  const pageStyle = (process.env.PORTFOLIO_STYLE || '').toLowerCase();

  switch (pageStyle) {
    case 'aesthetic':
      return <AestheticPage portfolio={portfolio} projects={projects} />;
    default:
      return <DefaultPage portfolio={portfolio} projects={projects} />;
  }
}
