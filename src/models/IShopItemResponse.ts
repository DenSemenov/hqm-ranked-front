export interface IShopItemResponse {
    id: string;
    group: ShopItemGroup;
    type: ShopItemType;
    description: string;
    cost: number;
    isPurchased: boolean;
    isSelected: boolean
}

export enum ShopItemGroup {
    AvatarShape,
    Frame,
    Background
}

export enum ShopItemType {
    //shapes
    Circle,
    Square,
    Star,
    Hexagon,
    Heart,
    Rhomb,
    Pacman,

    //frames
    Lightning,
    Rain,
    Sphere,
    Triangles,
    CircleFrame,

    //backgrounds
    City,
    Solar,
    SunAndSea,
    DarkSun,
    Solar2,
    Tree

}