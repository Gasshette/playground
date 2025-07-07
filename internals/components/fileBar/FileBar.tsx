import { useRef, useState } from 'react';
import { PlaygroundProps, usePlaygroundContext } from '@lib/index';
import { IconButton } from '../iconButton/IconButton';
import { PlusIcon } from '../../icons/PlusIcon';
import { FileItem } from './fileItem/FileItem';
import { MenuIcon } from '@int/icons/MenuIcon';
import { Popover } from 'react-tiny-popover';
import { Menu } from './menu/Menu';
import { CodeMirrorFile } from '@lib/types/CodeMirrorFile';
import { Scrollbar } from './scrollbar/Scrollbar';
import { PlayIcon } from '@int/icons/PlayIcon';
import { isValidFileNamePattern } from '@lib/utils';
import { RevertIcon } from '@int/icons/RevertIcon';
import './filebar.scss';

export const FileBar = (props: PlaygroundProps) => {
  const { multiFile } = props;

  const {
    events,
    fileBarRef,
    editorPaneRef,
    playgroundState: { files },
    setPlaygroundState
  } = usePlaygroundContext();

  const [isAdding, setIsAdding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const deleteHistory = useRef<Array<CodeMirrorFile>>([]);
  const fileListRef = useRef<HTMLDivElement>(null);

  const historizeDeletion = (file: CodeMirrorFile) => {
    deleteHistory.current = [...deleteHistory.current, file];
  };

  const reapplyFile = () => {
    if (deleteHistory.current.length > 0) {
      const file = deleteHistory.current.pop();

      if (file) {
        setPlaygroundState((prev) => ({
          ...prev,
          files: [...prev.files, file],
          currentFileName: prev.files.length <= 0 ? file.name : prev.currentFileName
        }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    const formData = new FormData(event.currentTarget);
    const fileName = formData.get('fileName');

    // SetTimeout of 0 to retrigger the error display
    setTimeout(() => {
      if (typeof fileName !== 'string') {
        setError('Invalid file name');
        return;
      }

      // Custom validation: must include a dot followed by at least one character
      if (!isValidFileNamePattern(fileName)) {
        setError('File name must contain a dot followed by at least one character');
        return;
      }

      if ([...files, ...deleteHistory.current].some((file) => file.name === fileName)) {
        setError('File name already used in the current or deleted files');
        return;
      }

      const newFile: CodeMirrorFile = { name: fileName };

      setPlaygroundState((prev) => ({
        ...prev,
        files: [...(prev.files ?? []), newFile],
        currentFileName: newFile.name
      }));

      setIsAdding(false);
    }, 0);
  };

  const handleClose = () => {
    setIsAdding(false);
    setError(null);
  };

  return (
    <div ref={fileBarRef} className="files-bar">
      <div className="file-list-wrapper">
        <div ref={fileListRef} className="file-list">
          {files.map((file) => (
            <FileItem {...props} key={file.name} file={file} onDelete={historizeDeletion} />
          ))}
          {isAdding && (
            <FileItem
              formMode
              {...props}
              onSubmit={handleSubmit}
              onClose={handleClose}
              error={error}
            />
          )}
        </div>
        <Scrollbar scrollContainerRef={fileListRef} />
      </div>
      <div className="button-container">
        {events.any('Run') && (
          <IconButton onClick={() => events.emit('Run')}>
            <PlayIcon />
          </IconButton>
        )}
        {multiFile && (
          <>
            <IconButton onClick={() => setIsAdding(true)}>
              <PlusIcon />
            </IconButton>
            <IconButton onClick={reapplyFile}>
              <RevertIcon />
            </IconButton>
          </>
        )}
        {/* Menu popover */}
        <Popover
          isOpen={isMenuOpen}
          parentElement={editorPaneRef.current ?? document.body}
          positions={['bottom', 'left']}
          onClickOutside={() => setIsMenuOpen(false)}
          content={<Menu />}>
          <IconButton
            style={{ justifySelf: 'flex-end' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuIcon />
          </IconButton>
        </Popover>
      </div>
    </div>
  );
};
