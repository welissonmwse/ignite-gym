import { Input as NativeBaseInput, IInputProps} from 'native-base';


export function Input({...props}: IInputProps){
  return(
    <NativeBaseInput
      {...props}
      bg="gray.700"
      h={14}
      px={4}
      mb={4}
      borderWidth={0}
      color="white"
      fontFamily="body"
      placeholderTextColor="gray.300"
      _focus={{
        bg: 'gray.700',
        borderWidth: 1,
        borderColor: 'green.500'
      }}
    />
  );
}
