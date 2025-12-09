import { readPortfolioConfig, readProjectsConfig } from '@/lib/config';
import DefaultPage from '@/app/layouts/DefaultPage';
import AestheticPage from '@/app/layouts/AestheticPage';

export default async function Home() {
  const portfolio = await readPortfolioConfig();
  const projects = await readProjectsConfig();
  const pageStyle = (process.env.PORTFOLIO_THEME || '').toLowerCase();

  switch (pageStyle) {
    case 'aesthetic':
      return <AestheticPage portfolio={portfolio} projects={projects} />;
    default:
      return <DefaultPage portfolio={portfolio} projects={projects} />;
  }
}
