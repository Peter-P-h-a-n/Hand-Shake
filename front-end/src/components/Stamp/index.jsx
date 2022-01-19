import styled from 'styled-components';

const Wrapper = styled.div`
  color: #c32530;
  font-size: 2.5rem;
  font-weight: 700;
  border: 0.3rem solid #c32530;
  display: inline-block;
  padding: 0.25rem 1rem;
  text-transform: uppercase;
  font-family: 'Courier';
  -webkit-mask-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png');
  -webkit-mask-size: 944px 604px;
  mix-blend-mode: multiply;
  opacity: 0.3;
`;

const Stamp = ({ text, ...ots }) => {
  return <Wrapper {...ots}>{text}</Wrapper>;
};

export default Stamp;
