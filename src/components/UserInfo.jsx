import { useSelector } from 'react-redux';

const UserInfo = () => {
  const userEmail = useSelector((state) => state.auth.user?.email);

  return (
    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg shadow-md border border-gray-300">
      <div className="text-sm font-medium text-gray-800 truncate max-w-[150px] sm:max-w-none">
        {userEmail || "Usuario"}
      </div>
    </div>
  );
};

export default UserInfo;
