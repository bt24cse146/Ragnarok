import Brand from './Brand';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <Brand />
      <span className="loading-indicator" aria-label="Loading" />
    </div>
  );
}
