import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { SvgXml } from 'react-native-svg';

const HomeIndicatorHeight = 34;

const BottomNavagation = ({ }: any): JSX.Element => {

    const styles = StyleSheet.create({
        container: {
            height: 55 + HomeIndicatorHeight,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingBottom: HomeIndicatorHeight - 30,
        },
        tabWrapper: {
            flexDirection: 'row',
        },
        tab: {
            flex: 1,
            justifyContent: 'center',
            gap: 7,
            alignItems: 'center',
            height: '100%',
        },
        icon: {
            width: 25,
            height: 25,
            borderRadius: 100,
        },
        iconCircle: {
            width: 25,
            height: 25,
            borderRadius: 100,
            borderColor: '#6b6bd7',
            borderWidth: 2,
        },
        label: {
            fontSize: 12,
            fontWeight: '600',
        }
    });

    /* 홈 icon xml */
    const HOME_ICON = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M23.6541 11.1511L12.8522 0.354836C12.7406 0.242401 12.6078 0.153158 12.4616 0.0922567C12.3153 0.0313551 12.1584 0 12 0C11.8416 0 11.6847 0.0313551 11.5384 0.0922567C11.3922 0.153158 11.2594 0.242401 11.1478 0.354836L0.345886 11.1511C0.179347 11.3198 0.066531 11.534 0.021674 11.7667C-0.0231831 11.9995 0.00192863 12.2402 0.0938406 12.4587C0.183881 12.6778 0.336786 12.8653 0.533286 12.9976C0.729786 13.13 0.961088 13.2012 1.19804 13.2024H2.39826V21.9594C2.42014 22.5205 2.66353 23.0502 3.07517 23.4323C3.4868 23.8145 4.03315 24.0182 4.59466 23.9987H7.79924C8.11756 23.9987 8.42284 23.8723 8.64792 23.6474C8.87301 23.4224 8.99946 23.1173 8.99946 22.7991V16.9212C8.99946 16.603 9.12591 16.2979 9.35099 16.0729C9.57608 15.8479 9.88136 15.7216 10.1997 15.7216H13.8003C14.1186 15.7216 14.4239 15.8479 14.649 16.0729C14.8741 16.2979 15.0005 16.603 15.0005 16.9212V22.7991C15.0005 23.1173 15.127 23.4224 15.3521 23.6474C15.5772 23.8723 15.8824 23.9987 16.2008 23.9987H19.4053C19.9668 24.0182 20.5132 23.8145 20.9248 23.4323C21.3365 23.0502 21.5799 22.5205 21.6017 21.9594V13.2024H22.802C23.0389 13.2012 23.2702 13.13 23.4667 12.9976C23.6632 12.8653 23.8161 12.6778 23.9062 12.4587C23.9981 12.2402 24.0232 11.9995 23.9783 11.7667C23.9335 11.534 23.8207 11.3198 23.6541 11.1511Z" fill="#6B6BD7" />
    </svg>
    `

    const showAlert = (screen: string) => {
        Alert.alert(
            '화면 전환',
            `${screen}으로 화면 전환합니다.`
        );
    }


    return (
        <Shadow distance={22} startColor={'#0000000a'} offset={[0, 7]} style={styles.container}>
            <View style={styles.tabWrapper}>
                <TouchableOpacity style={styles.tab} onPress={() => showAlert('홈')}>
                    <View style={styles.icon}>
                        <SvgXml xml={HOME_ICON} width="100%" height="100%" />
                    </View>
                    <Text style={styles.label}>홈</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => showAlert('보관함')}>
                    <View style={styles.iconCircle} />
                    <Text style={styles.label}>보관함</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => showAlert('설정')}>
                    <View style={styles.iconCircle} />
                    <Text style={styles.label}>설정</Text>
                </TouchableOpacity>
            </View>
        </Shadow>
    )
}

export default BottomNavagation;