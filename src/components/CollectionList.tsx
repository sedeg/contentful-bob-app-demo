import React from 'react';

import { EntrySys } from '@contentful/app-sdk';
import {
  EntityList,
  EntityListItem,
  HelpText,
  Button,
} from '@contentful/forma-36-react-components';
import { Link } from 'react-router-dom';

function getEntryStatus(entrySys: EntrySys) {
  if (!!entrySys.archivedVersion) {
    return 'archived';
  } else if (!!entrySys.publishedVersion && entrySys.version == entrySys.publishedVersion + 1) {
    return 'published';
  } else if (!!entrySys.publishedVersion && entrySys.version >= entrySys.publishedVersion + 2) {
    return 'changed';
  }
  return 'draft';
}

interface CollectionListProps {
  entries: any;
  onClickItem: (entryId: string) => void;
  onAddNew: any;
}

export default function CollectionList({ entries, onClickItem, onAddNew }: CollectionListProps) {
  // Loading state.
  if (!entries) {
    return (
      <EntityList className="f36-margin-top--m">
        {Array(3)
          .fill('')
          .map((_, i) => (
            <EntityListItem key={i} title="loading" isLoading />
          ))}
      </EntityList>
    );
  }

  if (entries.length) {
    return (
      <>
        <EntityList className="f36-margin-top--m f36-margin-bottom--m">
          {entries.map((entry: any) => {
            return (
              <Link to={`/details/${entry.sys.id}`}>
                <EntityListItem
                  className="cr-pointer"
                  entityType="entry"
                  key={entry.sys.id}
                  title={entry.fields.name.de}
                  status={getEntryStatus(entry.sys)}
                  contentType={entry.sys.contentType.type}
                />
              </Link>
            );
          })}
        </EntityList>
        <Button buttonType="positive" onClick={() => onAddNew()}>
          Create new page
        </Button>
      </>
    );
  }

  // No entries found (after fetching/loading).
  return <HelpText className="f36-margin-top--m">It's so empty in here 😲</HelpText>;
}
