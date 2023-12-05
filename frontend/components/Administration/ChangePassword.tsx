'use client'
import React from "react";
// import { useTranslations } from "next-intl";
import Input from "@/components/Shared/atoms/Input";
import Button from "../Shared/atoms/Button";
import { HandleChangePassword } from "@/components/utils/ApiCallers/ServerApiCallers";
import { Formik } from "formik";
import Feedback from "../Authentication/atoms/Feedback";
import { checkPassword } from "../Authentication/Validations";


const ChangePassword = ({ handleUserEdit, email, handleCloseModal }) => {

  const ChangePasswordTrans = (a) => a; // useTranslations('ChangePassword');

  return (
    <>
      <Formik
        initialValues={{ oldPassword: '', newPassword: '', newPasswordConfirm: '' }}
        validate={values => {
          const errors = {} as any;
          if (values.oldPassword === "") {
            errors.oldPassword = ChangePasswordTrans('Required');
          }
          if (values.newPassword === "") {
            errors.newPassword = ChangePasswordTrans('Required');
          }

          if (!checkPassword(values.newPassword)) {
            errors.newPassword = ChangePasswordTrans('PasswordRequirements');
          }

          if (values.newPasswordConfirm === "") {
            errors.newPasswordConfirm = ChangePasswordTrans('Required');
          }

          if (values.newPassword !== values.newPasswordConfirm) {
            errors.newPasswordConfirm = ChangePasswordTrans('PasswordsDontMatch');
          }
          return errors;
        }}

        onSubmit={(values, { setSubmitting }) => {
          HandleChangePassword(email, values.oldPassword, values.newPassword);
          console.log('Password changed successfully');
          setSubmitting(false);
          handleCloseModal();
        }}
      >
        {({
          errors,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          handleBlur,
        }) => (
          <form className="mb-2 h-full" onSubmit={handleSubmit}>
            <div className="flex flex-col justify-between h-full ">
              <div className="flex flex-col gap-2">
                <div>
                  <Input
                    name="oldPassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    label={ChangePasswordTrans('CurrentPass')}
                  />
                  {touched.oldPassword && errors.oldPassword && <Feedback>{errors.oldPassword}</Feedback>}
                </div>
                <div>

                  <Input
                    name="newPassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    label={ChangePasswordTrans('NewPass')}
                  />
                  {touched.newPassword && errors.newPassword && <Feedback className="max-w-[300px]" >{errors.newPassword}</Feedback>}
                </div>
                <div>
                  <Input
                    name="newPasswordConfirm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    label={ChangePasswordTrans('ConfirmPass')}
                  />
                  {touched.newPasswordConfirm && errors.newPasswordConfirm && <Feedback>{errors.newPasswordConfirm}</Feedback>}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={handleUserEdit} className="flex-grow" variant="outlined" >
                  {ChangePasswordTrans('Back')}
                </Button>
                <Button color="green" className="flex-grow" variant="filled" type="submit" disabled={isSubmitting}>
                  {ChangePasswordTrans('Change')}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}

export default ChangePassword;