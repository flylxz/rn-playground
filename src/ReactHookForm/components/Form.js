import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const formData = [
  {
    name: 'firstName',
    title: 'First Name',
    rules: { required: true },
    errorText: 'This is required',
    options: { autoFocus: true },
  },
  {
    name: 'lastName',
    title: 'Last Name',
    rules: { maxLength: 20 },
    errorText: 'Max length is 20',
    options: {},
  },
  {
    name: 'email',
    title: 'Email',
    rules: { type: 'email' },
    errorText: 'Enter correct email',
    options: { autoCapitalize: 'none', keyboardType: 'email-address' },
  },
  {
    name: 'password',
    title: 'Password',
    rules: { minLength: 8, maxLength: 12 },
    errorText: 'Password must be at least 8 characters',
    options: {
      secureTextEntry: true,
      autoCapitalize: 'none',
    },
  },
  {
    name: 'confirmPassword',
    title: 'Confirm Password',
    rules: { minLength: 8, maxLength: 12 },
    errorText: 'Password must be at least 8 characters',
    options: {
      secureTextEntry: true,
      autoCapitalize: 'none',
    },
  },
  {
    name: 'phone',
    title: 'Phone number',
    rules: { maxLength: 20 },
    errorText: 'Max length is 20',
    options: { keyboardType: 'number-pad' },
  },
  {
    name: 'about',
    title: 'About',
    rules: { maxLength: 200 },
    errorText: 'Max length is 200',
    options: { multiline: true },
  },
];

const schema = yup.object().shape({
  firstName: yup.string().required('First Name  is Required'),
  lastName: yup.string(),
  email: yup.string().email('Please enter valid email'),
  //   password: yup
  //     .string()
  //     .minLength(8, ({ min }) => `Password must be at least ${min} characters`)
  //     .maxLength(12, 8, ({ max }) => `Password must be max ${max} characters`)
  //     .password(),
  //   confirmPassword: yup
  //     .string()
  //     .oneOf([yup.ref('password')], 'Passwords do not match'),
  //   // about: yup.string().maxLength(200),
  //   // another: yup.string().maxLength(200),
});

export const Form = () => {
  const formRef = useRef({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    formRef.current.firstName.focus();
  }, []);

  const onSubmit = data => console.warn(data);

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 280 : 0;

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.avoidView}
        behavior="padding"
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        // keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {formData.map(item => (
          <View style={styles.inputContainer} key={item.name}>
            <Controller
              control={control}
              rules={item.rules}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={styles.titleText}>{item.title}:</Text>
                  <TextInput
                    ref={el => (formRef.current[item.name] = el)}
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={item.title}
                    placeholderTextColor={'#919191'}
                    {...item.options}
                  />
                </>
              )}
              name={item.name}
            />
            {errors[item.name] && (
              <Text style={styles.errorText}>{item.errorText}</Text>
            )}
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            rules={{}}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={styles.titleText}>Another about:</Text>
                <TextInput
                  ref={el => (formRef.current.another = el)}
                  style={[styles.input, { textAlignVertical: 'top' }]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Another"
                  placeholderTextColor={'#919191'}
                  numberOfLines={5}
                  // textAlignVertical={'top'}
                />
              </>
            )}
            name="another"
          />
          {errors.another && <Text style={styles.errorText}>Error</Text>}
        </View>

        <View style={styles.button}>
          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: 'green',
  },
  avoidView: {
    // backgroundColor: 'red',
    // paddingBottom: 50,
  },
  inputContainer: {
    minHeight: 80,
  },
  input: {
    backgroundColor: '#e9e9e9',
    padding: 5,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
    color: 'black',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-end',
  },
  titleText: {
    color: 'black',
  },
  button: {
    marginVertical: 50,
  },
});
