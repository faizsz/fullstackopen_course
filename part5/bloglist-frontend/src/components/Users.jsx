import { Link } from 'react-router-dom'

const Users = ({ users }) => (
  <div>
    <h2>Users</h2>
    <table>
      <thead>
        <tr><th>user</th><th>blogs created</th></tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
            <td>{u.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default Users