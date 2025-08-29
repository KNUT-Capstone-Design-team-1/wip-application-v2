import CustomAlert, {
  TCustomAlertButtons,
  TCustomModalType,
} from '@/components/organisms/CustomAlert';
import { createContext, useState, ReactNode, memo, useCallback } from 'react';

type TShowAlertOptions = {
  modalType: TCustomModalType;
  checkboxLabel?: string;
  onCheckboxChange?: (isChecked: boolean) => void;
  onRequestClose?: () => void;
};

interface AlertContextProps {
  showAlert: (
    title: string,
    message: string,
    buttons?: TCustomAlertButtons[],
    options?: TShowAlertOptions,
  ) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

const AlertProviderComponent = ({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [buttons, setButtons] = useState<TCustomAlertButtons[] | undefined>(
    undefined,
  );
  const [modalType, setModalType] = useState<TCustomModalType>('default');
  const [checkboxLabel, setCheckboxLabel] = useState<string>('');
  const [onCheckboxChange, setOnCheckboxChange] = useState<
    (isChecked: boolean) => void
  >(() => {});
  const [onRequestClose, setOnRequestClose] = useState<
    (() => void) | undefined
  >(undefined);

  const showAlert = useCallback(
    (
      title: string,
      message: string,
      buttons?: TCustomAlertButtons[],
      options?: TShowAlertOptions,
    ) => {
      const defaultOptions: Required<TShowAlertOptions> = {
        modalType: 'default',
        checkboxLabel: '',
        onCheckboxChange: () => {},
        onRequestClose: () => {},
      };

      const { modalType, checkboxLabel, onCheckboxChange, onRequestClose } = {
        ...defaultOptions,
        ...options,
      };
      setVisible(true);
      setTitle(title);
      setMessage(message);
      setButtons(buttons);
      setModalType(modalType);
      setCheckboxLabel(checkboxLabel);
      setOnCheckboxChange(() => onCheckboxChange);
      setOnRequestClose(() => onRequestClose);
    },
    [],
  );

  const requestCloseAlert = useCallback(() => {
    if (modalType !== 'exit') {
      setVisible(false);
    }
    if (onRequestClose) {
      onRequestClose();
    }
  }, [modalType, onRequestClose]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert
        visible={visible}
        onRequestClose={requestCloseAlert}
        title={title}
        message={message}
        buttons={buttons?.map((button) => ({
          ...button,
          onPress: () => {
            if (button.onPress) {
              button.onPress();
            }
            setVisible(false);
          },
        }))}
        modalType={modalType}
        checkboxLabel={checkboxLabel}
        onCheckboxChange={onCheckboxChange}
      />
    </AlertContext.Provider>
  );
};

const AlertProvider = memo(AlertProviderComponent);

export { AlertContext, AlertProvider };
