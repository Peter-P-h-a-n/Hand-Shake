import { useEffect } from 'react';
import styled from 'styled-components/macro';
import { Form as FinalForm, Field } from 'react-final-form';
import { Helmet } from 'components/Helmet';
import { useLocation, useHistory } from 'react-router-dom';

import { TextInput } from 'components/Input';
import { BackButton, PrimaryButton } from 'components/Button';

import { useDispatch } from 'hooks/useRematch';

import { required } from 'utils/inputValidation';
import { createRecruiment, editRecruiment } from 'services';
import { formatICXAmount, convertToICX } from 'connectors/Hana/utils';

const Wrapper = styled.div`
  padding: 30px 50px;
`;

const Form = styled.form`
  max-width: 600px;
  margin: 20px auto 0;
  padding-right: 35px;
  padding-left: 20px;
  background-color: #efefef;
  text-align: center;

  button {
    padding: 15px 20px;
    margin-top: 10px;
    width: 70% !important;
  }

  .input-field {
    margin-bottom: 20px;

    .label-wrapper {
      min-width: 180px;

      p {
        display: inline-block;
        width: 100%;
        text-align: left;
      }
    }
  }
`;

const CreateContract = ({ isEdit }) => {
  const { state } = useLocation();
  const { push } = useHistory();
  const { setNotification } = useDispatch(({ modal: { setNotification } }) => ({
    setNotification,
  }));

  useEffect(() => {
    if (isEdit && !state) {
      push('404');
    }
  }, [isEdit, push, state]);

  const onSubmit = async (values) => {
    const { deadline, salary, deposit } = values;

    try {
      const payload = {
        ...values,
        deadline: new Date(deadline).toISOString(),
        salary: formatICXAmount(salary),
        deposit: formatICXAmount(deposit),
      };

      if (isEdit) {
        await editRecruiment(payload);
        push('/details/' + state.id);
      } else {
        const { id } = await createRecruiment(payload);
        push('/details/' + id);
      }

      setNotification({ type: 'success', text: 'Success!', timeout: true });
    } catch (err) {
      setNotification({ type: 'error', text: 'Failed!', timeout: true });
    }
  };

  const getInitialValues = () => {
    if (!state) return {};

    const { id, title, description, salary, deposit, contact } = state;
    const local = new Date(state.deadline);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());

    return {
      id,
      title,
      description,
      salary: convertToICX(salary),
      deposit: convertToICX(deposit),
      contact,
      deadline: local.toJSON().slice(0, 10),
    };
  };

  const getMinDate = () => {
    const today = new Date();
    let dd = today.getDate() + 1;
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' + dd;
  };

  return (
    <Wrapper>
      <Helmet title="Create Recruitment" />
      <BackButton url={isEdit ? '' : '/recruitment'}>
        {isEdit ? 'Edit' : 'Create'} Recruitment
      </BackButton>

      <FinalForm
        onSubmit={onSubmit}
        initialValues={getInitialValues()}
        render={({ handleSubmit, form }) => {
          return (
            <Form
              onSubmit={async (event) => {
                await handleSubmit(event);
                form.restart();
              }}
            >
              <div className="input-group">
                <div className="input-field">
                  <Field
                    name="title"
                    validate={required}
                    render={({ input, meta }) => (
                      <TextInput label="Title" placeholder="A short title" {...input} meta={meta} />
                    )}
                  />
                </div>

                <div className="input-field">
                  <Field
                    name="description"
                    validate={required}
                    render={({ input, meta }) => (
                      <TextInput
                        label="Description"
                        isTextarea
                        placeholder="Description here"
                        {...input}
                        meta={meta}
                      />
                    )}
                  />
                </div>

                <div className="input-field">
                  <Field
                    name="deadline"
                    validate={required}
                    render={({ input, meta }) => (
                      <TextInput
                        label="Deadline"
                        type="date"
                        min={getMinDate()}
                        placeholder="Description here"
                        {...input}
                        meta={meta}
                      />
                    )}
                  />
                </div>

                <div className="input-field">
                  <Field
                    name="salary"
                    validate={required}
                    render={({ input, meta }) => (
                      <TextInput
                        label="Salary (ICX)"
                        type="number"
                        placeholder="Your payment amount"
                        {...input}
                        meta={meta}
                      />
                    )}
                  />
                </div>

                <div className="input-field">
                  <Field
                    name="deposit"
                    validate={required}
                    render={({ input, meta }) => (
                      <TextInput
                        label="Deposit (ICX)"
                        type="number"
                        placeholder="Freelancer's deposit amount"
                        {...input}
                        meta={meta}
                      />
                    )}
                  />
                </div>

                <div className="input-field">
                  <Field
                    name="contact"
                    validate={required}
                    render={({ input, meta }) => (
                      <TextInput
                        label="Contact"
                        placeholder="Email or phone number"
                        {...input}
                        meta={meta}
                      />
                    )}
                  />
                </div>
              </div>
              <PrimaryButton htmlType="submit" className="lg">
                {isEdit ? 'Edit' : 'Create'}
              </PrimaryButton>
            </Form>
          );
        }}
      />
    </Wrapper>
  );
};

export default CreateContract;
