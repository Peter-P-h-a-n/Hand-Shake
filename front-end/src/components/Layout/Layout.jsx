import styled from 'styled-components/macro';
import { Header } from 'components/Header';
import { media } from 'components/Styles/Media';

import waveBg from 'assets/images/wave-bg.svg';

const StyledLayout = styled.div`
  position: relative;

  > .warning {
    display: none;
  }

  > main {
    background-color: #efefef;
    background-image: url('${waveBg}');
    background-repeat: repeat;
    min-height: calc(100vh - 80px); // minus header height
  }

  ${media.md`
    > main, header {
      display: none;
    }

    > .warning {
    display: block;
  }
  `}
`;

const Layout = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <main>{children}</main>
      <p className="warning">
        We do not serve this app for mobile version, please use the desktop version for better
        experience!
      </p>
    </StyledLayout>
  );
};

export default Layout;
