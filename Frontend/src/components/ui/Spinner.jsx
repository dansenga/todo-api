import clsx from 'clsx';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={clsx('relative', sizes[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
    </div>
  );
};

const LoadingScreen = ({ message = 'Chargement...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <Spinner size="xl" />
    <p className="mt-4 text-gray-600 font-medium">{message}</p>
  </div>
);

Spinner.Screen = LoadingScreen;

export default Spinner;
