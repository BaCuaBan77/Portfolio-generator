import { readPortfolioConfig, readProjectsConfig } from '@/lib/config';
import DefaultPage from '@/app/layouts/Default/DefaultPage';
import AestheticPage from '@/app/layouts/Aesthetic/AestheticPage';

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
