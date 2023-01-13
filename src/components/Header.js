import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import ReactToPrint from 'react-to-print';
import Logo from '../assets/gdocsLogo.png'
function Header({ componentRef, handleCopyClick, isCopied, fileName }) {
    return (
        <Navbar collapseOnSelect sticky="top" expand="lg" style={{ background: "white", padding: "2px" }}>
            <Container>
                <Navbar.Brand href=""><img src={Logo} alt="GDocs" className='logo' />{fileName}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav>
                        <ReactToPrint
                            trigger={() => <div className='btn btn-primary m-1'>Dowload</div>
                            }
                            content={() => componentRef.current}
                        />
                        <div className='btn btn-success m-1' onClick={handleCopyClick}>{isCopied ? 'Copied Link!' : 'Copy Link'}</div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;