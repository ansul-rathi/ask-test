import { useParams, useRouter } from 'next/navigation';

const useNavigateWithLocale = () => {
  const router = useRouter()
  const locale = useParams();

  const navigateTo = (to: string) => {
    router.push(`/${locale || 'en'}${to}`);
  };

  return navigateTo;
};

export default useNavigateWithLocale;
