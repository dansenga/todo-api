import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { validateLogin } from '../utils/validation';
import { AuthLayout } from '../components/layout';
import { Button, Input } from '../components/ui';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateLogin(email, password);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.userMessage || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AuthLayout 
      title="Bon retour !" 
      subtitle="Connectez-vous pour accéder à vos tâches"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Adresse email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError('email');
          }}
          placeholder="vous@exemple.com"
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Mot de passe"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError('password');
          }}
          placeholder="••••••••"
          error={errors.password}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
        >
          Se connecter
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">
              Nouveau sur TaskFlow ?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/register">
            <Button variant="outline" fullWidth>
              Créer un compte
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
