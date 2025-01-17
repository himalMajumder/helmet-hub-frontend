import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="flex space-x-4">
      <Link 
        to="/dealer-directory" 
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Dealer Directory
      </Link>
      <Link 
        to="/customer-information" 
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Customer Information
      </Link>
      <Link 
        to="/warranty-registration" 
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Warranty Registration
      </Link>
    </nav>
  );
};

export default Navigation;