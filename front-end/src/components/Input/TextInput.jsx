import styled from 'styled-components/macro';
import { Input } from './Input';
import { colors } from '../Styles/Colors';
import { TextMixin, Text } from 'components/Typography/Text';

const Wrapper = styled.div`
  display: flex;
  width: 100%;

  .label-wrapper {
    transform: skewX(-30deg);
    padding-right: 20px;
    padding-left: 40px;

    display: grid;
    place-items: center;
    background-color: #0970b0;
    position: relative;

    ::before {
      content: '';
      position: absolute;
      left: -20px;
      top: 0;
      width: 43px;
      height: 100%;
      background-color: #efefef;
      transform: skewX(30deg);
    }

    > .plain-text {
      color: white;
      transform: skewX(30deg);
    }
  }
`;

const InputWrapper = styled.div`
  border: solid 1px ${({ hasError }) => (hasError ? colors.errorState : '#0970b0')};
  background-color: white;
  padding: 8px 20px;
  border-radius: 0 50px 0px 0;

  flex: 1;
  transform: skewX(-30deg);

  > input,
  textarea {
    transform: skewX(30deg);
    ${TextMixin.md};
    background-color: transparent;
    color: #4c334d;
    padding: 5px 0;
    width: 100%;

    &[type='date'] {
      cursor: pointer;
    }
  }
`;

const ErrorMessage = styled(Text)`
  padding-left: 23px;
  text-align: left;
`;

export const TextInput = ({ children, meta = {}, label, isTextarea, ...props }) => {
  const hasError = meta.error && meta.touched;

  return (
    <>
      <Wrapper>
        {label && (
          <div className="label-wrapper">
            <Text className="sm">{label}</Text>
          </div>
        )}
        <InputWrapper hasError={hasError}>
          {isTextarea ? <textarea {...props} /> : <Input {...props}>{children}</Input>}
        </InputWrapper>
      </Wrapper>
      {hasError && <ErrorMessage className="xs err-msg">{meta.error}</ErrorMessage>}
    </>
  );
};
