const LoginForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleSubmit }) => {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            username
            <input
              type="text"
              value={username}
              data-testid="username"
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              data-testid="password"
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }
  
  export default LoginForm