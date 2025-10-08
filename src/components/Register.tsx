import React, { useState, useCallback, useMemo } from 'react';
import { Mail, Key, User, Github, Chrome } from 'lucide-react'; 

interface FormData {
  name: string;
  user_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface InputFieldProps {
  id: keyof FormData;
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ElementType;
  isError?: boolean;
  colSpan?: 'full' | 'half';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  isError = false,
  colSpan = 'full',
  value,
  onChange,
}) => (
  <div
    className={`flex flex-col space-y-1 ${
      colSpan === 'half' ? 'lg:col-span-1' : 'lg:col-span-2 col-span-2'
    }`}
  >
    <label htmlFor={id} className="text-sm font-medium text-gray-200">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className={`
          w-full py-3 pl-12 pr-4 text-white
          bg-gray-800 border-2 rounded-lg 
          focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
          transition duration-200 ease-in-out
          ${isError ? 'border-red-500' : 'border-gray-700'}
        `}
      />
    </div>
  </div>
);

const SocialSignIn: React.FC = () => (
  <div className="mt-8 space-y-4">
    <h2 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
      Or Sign Up With
    </h2>

    {/* GitHub Button */}
    <button
      className="w-full flex items-center justify-center py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition duration-200 shadow-md transform hover:scale-[1.01] focus:ring-2 focus:ring-cyan-500"
      onClick={() => alert('GitHub Login Clicked')}
    >
      <Github className="h-6 w-6 mr-3 text-white" />
      Sign In with GitHub
    </button>

    {/* Google Button */}
    <button
      className="w-full flex items-center justify-center py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition duration-200 shadow-md transform hover:scale-[1.01] focus:ring-2 focus:ring-cyan-500"
      onClick={() => alert('Google Login Clicked')}
    >
      <Chrome className="h-6 w-6 mr-3 text-red-400" />
      Sign In with Google
    </button>

    <p className="text-sm text-center text-gray-400 pt-4">
      Already have an account?{' '}
      <a
        href="#"
        className="text-cyan-400 hover:text-cyan-300 font-bold transition duration-200"
      >
        Sign In
      </a>
    </p>
  </div>
);

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const passwordsMatch = useMemo(
    () => formData.password === formData.confirmPassword,
    [formData.password, formData.confirmPassword]
  );

  const isFormValid = useMemo(() => {
    const { name, user_name, email, password, confirmPassword } = formData;
    return (
      name && user_name && email && password && confirmPassword && passwordsMatch
    );
  }, [formData, passwordsMatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please fill all fields and ensure passwords match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    console.log('Submitting:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Registration initiated! Check your email for verification.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 flex items-center justify-center font-inter">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-gray-800 overflow-hidden">
        {/* Left Banner Section */}
        <div className="hidden lg:flex lg:w-1/3 min-h-[600px] bg-indigo-900/50 items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-80"></div>
          <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-cyan-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-fuchsia-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-mono font-bold text-white mb-4">
              {'<Codebase />'}
            </h2>
            <p className="text-lg text-gray-300 italic">
              Your hub for software engineering tasks.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full lg:w-2/3 p-6 sm:p-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500 bg-gray-900 flex items-center justify-center text-cyan-300 shadow-xl">
              <User className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-wider">
              Welcome
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="name"
                label="Name"
                placeholder="Enter Your Name"
                icon={User}
                colSpan="half"
                value={formData.name}
                onChange={handleChange}
              />
              <InputField
                id="user_name"
                label="User Name"
                placeholder="Enter Your Username"
                icon={User}
                colSpan="half"
                value={formData.user_name}
                onChange={handleChange}
              />
            </div>

            <InputField
              id="email"
              label="Email"
              placeholder="iam.engineer@example.com"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="password"
                label="Password"
                placeholder="Enter Password"
                type="password"
                icon={Key}
                colSpan="half"
                value={formData.password}
                onChange={handleChange}
                isError={!passwordsMatch && formData.confirmPassword.length > 0}
              />
              <InputField
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Enter again"
                type="password"
                icon={Key}
                colSpan="half"
                value={formData.confirmPassword}
                onChange={handleChange}
                isError={!passwordsMatch && formData.confirmPassword.length > 0}
              />
            </div>

            {error && (
              <p className="text-sm text-center text-red-400 font-medium">
                {error}
              </p>
            )}
            {!passwordsMatch && formData.confirmPassword.length > 0 && (
              <p className="text-sm text-center text-red-400 font-medium">
                Passwords do not match.
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    name: '',
                    user_name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                  })
                }
                className="py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`
                  py-3 font-semibold rounded-lg transition duration-200
                  ${
                    isFormValid && !isSubmitting
                      ? 'bg-cyan-500 text-gray-900 hover:bg-cyan-400 shadow-lg shadow-cyan-500/30'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? 'Registering...' : 'Submit'}
              </button>
            </div>
          </form>

          <SocialSignIn />
        </div>
      </div>
    </div>
  );
};

export default Register;