import { IconButton } from '@int/components/iconButton/IconButton';
import { RemoveIcon } from '@int/icons/RemoveIcon';
import { SendIcon } from '@int/icons/SendIcon';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import { defaultFile, PlaygroundProps, usePlaygroundContext } from '@lib/index';
import { CodeMirrorFile } from '@lib/types/CodeMirrorFile';
import { Popover } from 'react-tiny-popover';
import { Toast } from '@int/components/toast/Toast';
import './FileItem.scss';

interface FileItemProps extends Omit<PlaygroundProps, 'View'> {
  file?: CodeMirrorFile;
  formMode?: boolean;
  error?: string | null;
  onDelete?: (file: CodeMirrorFile) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose?: () => void;
}

export const FileItem = (props: FileItemProps) => {
  const { file, formMode, error, onSubmit, onClose, onDelete, multiFile } = props;

  const [isToastOpen, setIsToastOpen] = useState(false);

  const {
    editorPaneRef,
    playgroundState: {
      currentFileName,
      files,
      editorConfig: { theme: selectedTheme }
    },
    setPlaygroundState,
    fileBarThemes: theme
  } = usePlaygroundContext();
  const { dark, light } = theme;

  const { isSelected, indicatorColor } = useMemo(() => {
    const isSelected = file?.name === currentFileName;
    const indicatorColor = `2px solid ${
      isSelected
        ? selectedTheme === 'dark'
          ? dark.colors.indicator
          : light.colors.indicator
        : 'transparent'
    }`;

    return { isSelected, indicatorColor };
  }, [file, currentFileName, selectedTheme, dark, light]);

  const handleFileChange = () => {
    if (!file || file.name === currentFileName) {
      return;
    }

    setPlaygroundState((prev) => ({ ...prev, currentFileName: file.name }));
  };

  const handleDeleteFile = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileName: string
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const fileToRemove = files?.find((file) => file.name === fileName);
    const newFiles = files?.filter((file) => file.name !== fileName);

    if (newFiles && fileToRemove) {
      onDelete?.(fileToRemove);

      if (newFiles.length <= 0) {
        setPlaygroundState((prev) => ({
          ...prev,
          files: [defaultFile],
          currentFileName: defaultFile.name,
          removedFile: fileName
        }));
        return;
      }

      if (files.length > 1) {
        const index = files.indexOf(fileToRemove);
        const targetIndex = index <= 0 ? 0 : index - 1;

        setPlaygroundState((prev) => ({
          ...prev,
          files: newFiles,
          currentFileName: newFiles[targetIndex].name,
          removedFile: fileName
        }));
      }
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onSubmit?.(event);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (error) {
      setIsToastOpen(true);
      timer = setTimeout(() => setIsToastOpen(false), 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  return (
    <div
      key={file?.name ?? 'formMode'}
      className={`file-item${isSelected ? ' selected' : ''}`}
      {...(file && { onClick: () => handleFileChange() })}>
      {!formMode ? (
        <>
          <IconButton disabled className="btn-remove" style={{ visibility: 'hidden' }}>
            {/* Arbitraty icon here, only here to have the same layout and sizing on both sides */}
            <RemoveIcon size={18} />
          </IconButton>
          {file?.name}
          <IconButton
            className={`btn-remove${multiFile ? '' : ' hidden'}`}
            variant="danger"
            {...(file && { onClick: (event) => handleDeleteFile(event, file.name) })}>
            <RemoveIcon size={18} />
          </IconButton>
        </>
      ) : (
        <Popover
          isOpen={isToastOpen}
          parentElement={editorPaneRef.current ?? document.body}
          positions={['bottom', 'left']}
          content={<Toast content={error} />}>
          <form className={`add-form${error ? ' errored' : ''}`} onSubmit={handleSubmit}>
            <input autoFocus type="text" name="fileName" placeholder="file name" />
            <IconButton type="submit">
              <SendIcon size={18} />
            </IconButton>
            <IconButton type="button" variant="danger" onClick={onClose}>
              <RemoveIcon size={18} />
            </IconButton>
          </form>
        </Popover>
      )}
      <div
        style={{
          display: formMode ? 'none' : 'block',
          position: 'absolute',
          width: '100%',
          height: 0,
          bottom: 0,
          left: 0,
          borderBottom: indicatorColor
        }}></div>
    </div>
  );
};
