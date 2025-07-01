import { useParams, useRouter } from 'next/navigation';

const useNavigateWithLocale = () => {
  const router = useRouter();
  const params = useParams();

  // Extract the locale from the params and default to 'en' if not available
  const locale = params?.locale || 'en'; // Adjust 'locale' based on your routing if needed

  const navigateTo = (to: string) => {
    
    const path = to.startsWith('/') ? to : `/${to}`;
    router.push(`/${locale}${path}`);
  };

  return navigateTo;
};

export default useNavigateWithLocale;
