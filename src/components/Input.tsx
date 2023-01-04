import { Input as NativeBaseInput, IInputProps, FormControl} from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null
}


export function Input({errorMessage = null,...props}: Props){
  const isInvalid = !!errorMessage;

  return(
    <FormControl isInvalid={isInvalid} mb={4}>
      <NativeBaseInput
        {...props}
        h={14}
        px={4}
        borderWidth={0}
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        isInvalid={isInvalid}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500'
        }}
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500'
        }}
      />
      <FormControl.ErrorMessage _text={{color: 'red.500'}} mt={0}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
