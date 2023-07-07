import { extendTheme, type ThemeConfig, type ChakraTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
}

const styles: ChakraTheme['styles'] = {
    global: (props) => ({
        'html body': {
            bg: mode('gray.50', 'gray.800')(props),
        },
    }),
}

const theme = extendTheme({
    config,
    styles
})

export default theme