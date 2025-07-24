
import { useTranslation } from 'react-i18next';

function WelcomePage() {

  return (
    <div className="max-w-6xl mx-auto justify-items-center">
        <div className="flex justify-between items-center mb-8">
 
            <div className="flex flex-col items-center justify-center h-96 space-y-4">

                <div className="text-center space-y-2">
                    <h3 className="text-2xl items-center justify-center font-semibold">Welcome to Our Product Management System</h3>
                    <p className="text-gray-500 max-w-sm">
                        Get started by adding your first product to the inventory
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
export default WelcomePage;
