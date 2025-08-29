import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './layout'
import { LandingPage } from '../features/landing/LandingPage'
import { BuildVault } from '../features/vault/BuildVault'
import { CharacterBuilder } from '../features/builder/CharacterBuilder'
import { DPRLab } from '../features/dpr/DPRLab'
import { ComparePage } from '../features/compare/ComparePage'
import { LevelPathExplorer } from '../features/explorer/LevelPathExplorer'
import { SettingsPage } from '../features/settings/SettingsPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: 'vault',
          element: <BuildVault />,
        },
        {
          path: 'builder',
          element: <CharacterBuilder />,
        },
        {
          path: 'builder/:buildId',
          element: <CharacterBuilder />,
        },
        {
          path: 'dpr-lab',
          element: <DPRLab />,
        },
        {
          path: 'compare',
          element: <ComparePage />,
        },
        {
          path: 'explorer',
          element: <LevelPathExplorer />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
      ],
    },
  ],
  {
    basename: '/The-Destiny-Ledger',
  }
)