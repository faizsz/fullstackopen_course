import { Link } from 'react-router-dom'
import { Navbar, Nav as BsNav, Button } from 'react-bootstrap'

const Nav = ({ user, handleLogout }) => (
  <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
    <BsNav className="me-auto">
      <BsNav.Link as={Link} to="/">blogs</BsNav.Link>
      <BsNav.Link as={Link} to="/users">users</BsNav.Link>
    </BsNav>
    {user && (
      <span className="text-white me-2">
        {user.name} logged in{' '}
        <Button size="sm" variant="outline-light" onClick={handleLogout}>logout</Button>
      </span>
    )}
  </Navbar>
)

export default Nav