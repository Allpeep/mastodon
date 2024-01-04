import logo from 'mastodon/../images/logo.svg';

export const WordmarkLogo: React.FC = () => (
  <svg viewBox='0 0 261 66' className='logo logo--wordmark' role='img'>
    <title>AllPeep</title>
    <use xlinkHref='#logo-symbol-wordmark' />
  </svg>
);

export const SymbolLogo: React.FC = () => (
  <img src={logo} alt='AllPeep' className='logo logo--icon' />
);
