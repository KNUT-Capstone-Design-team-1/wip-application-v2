import { useCallback, useMemo, useState } from 'react';
import { normalizeImageUri } from '../utils/pill_image_util';

// URL 변경 시 새 이미지를 허용하고 실패한 URL에만 대체 이미지를 표시한다.
export const usePillImageSource = (imageUri?: string | null) => {
  const uri = useMemo(() => normalizeImageUri(imageUri), [imageUri]);
  const source = useMemo(() => (uri ? { uri } : undefined), [uri]);
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const onError = useCallback(() => setFailedUri(uri), [uri]);
  return { source, hasImage: !!uri && failedUri !== uri, onError };
};
