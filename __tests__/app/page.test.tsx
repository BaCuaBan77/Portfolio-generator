/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { readPortfolioConfig, readProjectsConfig } from '@/lib/config';

// Mock the config functions
jest.mock('@/lib/config', () => ({
  readPortfolioConfig: jest.fn(),
  readProjectsConfig: jest.fn(),
}));

// Mock the layout components with test IDs
jest.mock('@/app/layouts/Default/DefaultPage', () => ({
  __esModule: true,
  default: jest.fn((props: any) => 
    React.createElement('div', { 'data-testid': 'default-page' }, 'Default Page')
  ),
}));

jest.mock('@/app/layouts/Aesthetic/AestheticPage', () => ({
  __esModule: true,
  default: jest.fn((props: any) => 
    React.createElement('div', { 'data-testid': 'aesthetic-page' }, 'Aesthetic Page')
  ),
}));

// Import after mocks are set up
import Home from '@/app/page';
import DefaultPage from '@/app/layouts/Default/DefaultPage';
import AestheticPage from '@/app/layouts/Aesthetic/AestheticPage';

describe('Home page component', () => {
  const mockReadPortfolioConfig = readPortfolioConfig as jest.MockedFunction<
    typeof readPortfolioConfig
  >;
  const mockReadProjectsConfig = readProjectsConfig as jest.MockedFunction<
    typeof readProjectsConfig
  >;

  const mockPortfolio = {
    name: 'Test User',
    title: 'Developer',
    bio: 'Test bio',
    email: 'test@example.com',
    githubUsername: 'testuser',
    domains: ['Tech'],
    skills: [],
    experience: [],
    socialLinks: {
      linkedin: '',
      twitter: '',
      website: '',
    },
  };

  const mockProjects = [
    {
      id: 'project1',
      name: 'Project 1',
      description: 'Description',
      abstract: 'Abstract',
      category: 'professional' as const,
      technologies: ['React'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
    mockReadProjectsConfig.mockResolvedValue(mockProjects as any);
    delete process.env.PORTFOLIO_STYLE;
  });

  afterEach(() => {
    delete process.env.PORTFOLIO_STYLE;
  });

  it('should render DefaultPage when PORTFOLIO_STYLE is not set', async () => {
    const component = await Home();
    const { getByTestId } = render(component);

    expect(mockReadPortfolioConfig).toHaveBeenCalled();
    expect(mockReadProjectsConfig).toHaveBeenCalled();
    expect(getByTestId('default-page')).toBeInTheDocument();
    expect(DefaultPage).toHaveBeenCalledWith(
      { portfolio: mockPortfolio, projects: mockProjects },
      undefined
    );
  });

  it('should render DefaultPage when PORTFOLIO_STYLE is "default"', async () => {
    process.env.PORTFOLIO_STYLE = 'default';

    const component = await Home();
    const { getByTestId } = render(component);

    expect(getByTestId('default-page')).toBeInTheDocument();
    expect(DefaultPage).toHaveBeenCalledWith(
      { portfolio: mockPortfolio, projects: mockProjects },
      undefined
    );
    expect(AestheticPage).not.toHaveBeenCalled();
  });

  it('should render DefaultPage when PORTFOLIO_STYLE is "DEFAULT" (case insensitive)', async () => {
    process.env.PORTFOLIO_STYLE = 'DEFAULT';

    const component = await Home();
    const { getByTestId } = render(component);

    expect(getByTestId('default-page')).toBeInTheDocument();
    expect(DefaultPage).toHaveBeenCalledWith(
      { portfolio: mockPortfolio, projects: mockProjects },
      undefined
    );
    expect(AestheticPage).not.toHaveBeenCalled();
  });

  it('should render AestheticPage when PORTFOLIO_STYLE is "aesthetic"', async () => {
    process.env.PORTFOLIO_STYLE = 'aesthetic';

    const component = await Home();
    const { getByTestId } = render(component);

    expect(getByTestId('aesthetic-page')).toBeInTheDocument();
    expect(AestheticPage).toHaveBeenCalledWith(
      { portfolio: mockPortfolio, projects: mockProjects },
      undefined
    );
    expect(DefaultPage).not.toHaveBeenCalled();
  });

  it('should render AestheticPage when PORTFOLIO_STYLE is "AESTHETIC" (case insensitive)', async () => {
    process.env.PORTFOLIO_STYLE = 'AESTHETIC';

    const component = await Home();
    const { getByTestId } = render(component);

    expect(getByTestId('aesthetic-page')).toBeInTheDocument();
    expect(AestheticPage).toHaveBeenCalledWith(
      { portfolio: mockPortfolio, projects: mockProjects },
      undefined
    );
    expect(DefaultPage).not.toHaveBeenCalled();
  });

  it('should render DefaultPage for unknown PORTFOLIO_STYLE values', async () => {
    process.env.PORTFOLIO_STYLE = 'unknown-style';

    const component = await Home();
    const { getByTestId } = render(component);

    expect(getByTestId('default-page')).toBeInTheDocument();
    expect(DefaultPage).toHaveBeenCalledWith(
      { portfolio: mockPortfolio, projects: mockProjects },
      undefined
    );
    expect(AestheticPage).not.toHaveBeenCalled();
  });

  it('should pass portfolio and projects to both layout components', async () => {
    const customPortfolio = { ...mockPortfolio, name: 'Custom Name' };
    const customProjects = [...mockProjects, { id: 'project2', name: 'Project 2' } as any];

    mockReadPortfolioConfig.mockResolvedValue(customPortfolio as any);
    mockReadProjectsConfig.mockResolvedValue(customProjects as any);

    // Test with default
    process.env.PORTFOLIO_STYLE = 'default';
    const defaultComponent = await Home();
    render(defaultComponent);
    expect(DefaultPage).toHaveBeenCalledWith(
      { portfolio: customPortfolio, projects: customProjects },
      undefined
    );

    jest.clearAllMocks();

    // Test with aesthetic
    process.env.PORTFOLIO_STYLE = 'aesthetic';
    const aestheticComponent = await Home();
    render(aestheticComponent);
    expect(AestheticPage).toHaveBeenCalledWith(
      { portfolio: customPortfolio, projects: customProjects },
      undefined
    );
  });
});
