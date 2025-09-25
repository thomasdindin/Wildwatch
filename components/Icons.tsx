import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

interface IconProps {
  color?: string;
  size?: number;
}

export const CameraIcon = ({ color = '#999', size = 24 }: IconProps) => (
  <Ionicons name="camera" size={size} color={color} />
);

export const EditIcon = ({ color = '#2196F3', size = 18 }: IconProps) => (
  <Feather name="edit-2" size={size} color={color} />
);

export const DeleteIcon = ({ color = '#F44336', size = 18 }: IconProps) => (
  <Feather name="trash-2" size={size} color={color} />
);

export const LeafIcon = ({ color = '#4CAF50', size = 64 }: IconProps) => (
  <Ionicons name="leaf" size={size} color={color} />
);

export const CalendarIcon = ({ color = '#666', size = 20 }: IconProps) => (
  <Ionicons name="calendar-outline" size={size} color={color} />
);

export const LocationIcon = ({ color = '#007AFF', size = 20 }: IconProps) => (
  <Ionicons name="locate" size={size} color={color} />
);

export const TargetIcon = ({ color = '#FF6B35', size = 20 }: IconProps) => (
  <MaterialIcons name="gps-fixed" size={size} color={color} />
);

export const MapIcon = ({ color = '#000', size = 20 }: IconProps) => (
  <Ionicons name="map" size={size} color={color} />
);

export const ListIcon = ({ color = '#000', size = 20 }: IconProps) => (
  <Ionicons name="list" size={size} color={color} />
);

export const PawIcon = ({color = "#4CAF50", size = 20} : IconProps) => (
    <Ionicons name="paw" size={size} color={color}/>
);

export const ShareIcon = ({ color = '#007AFF', size = 18 }: IconProps) => (
  <Ionicons name="share-outline" size={size} color={color} />
);

export const CloseIcon = ({ color = '#666', size = 18 }: IconProps) => (
  <Ionicons name="close" size={size} color={color} />
);

export const SaveIcon = ({ color = '#007AFF', size = 18 }: IconProps) => (
  <Ionicons name="save-outline" size={size} color={color} />
);