import TwitterLogin from 'react-twitter-auth';

const Login = () => {
  const onSuccess = () => {
    console.log('success');
  };

  const onFailed = () => {
    console.log('failed');
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <TwitterLogin
        loginUrl="https://react-twitter-auth.onrender.com/api/v1/auth/twitter"
        onFailure={onFailed}
        onSuccess={onSuccess}
        requestTokenUrl="https://react-twitter-auth.onrender.com/api/v1/auth/twitter/reverse"
        showIcon={true}
        forceLogin={true}
        className="flex"
      />
    </div>
  );
};

export default Login;
