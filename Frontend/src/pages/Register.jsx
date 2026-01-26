import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { validateRegister } from '../utils/validation';
import { AuthLayout } from '../components/layout';
import { Button, Input } from '../components/ui';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateRegister(
      name, email, password, passwordConfirmation
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(name, email, password, passwordConfirmation);
      toast.success('Inscription réussie ! Bienvenue !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.userMessage || 'Erreur lors de l\'inscription');
      if (err.userErrors) {
        setErrors(err.userErrors);
      }
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
      title="Créer un compte" 
      subtitle="Commencez à organiser vos tâches dès maintenant"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nom complet"
          type="text"
          icon={User}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearError('name');
          }}
          placeholder="Jean Dupont"
          error={errors.name}
          autoComplete="name"
        />

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
          placeholder="Minimum 8 caractères"
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          icon={Lock}
          value={passwordConfirmation}
          onChange={(e) => {
            setPasswordConfirmation(e.target.value);
            clearError('passwordConfirmation');
          }}
          placeholder="Répétez votre mot de passe"
          error={errors.passwordConfirmation}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
        >
          Créer mon compte
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">
              Déjà inscrit ?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/login">
            <Button variant="outline" fullWidth>
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
