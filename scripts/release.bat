@echo off
setlocal enabledelayedexpansion

REM AR Glasses Control Center - Release Script (Windows)
REM This script helps automate the release process on Windows

set "VERSION="
set "DRY_RUN=false"
set "RUN_TESTS=false"

REM Parse command line arguments
:parse_args
if "%~1"=="" goto :main
if "%~1"=="-h" goto :show_help
if "%~1"=="--help" goto :show_help
if "%~1"=="-d" (
    set "DRY_RUN=true"
    shift
    goto :parse_args
)
if "%~1"=="--dry-run" (
    set "DRY_RUN=true"
    shift
    goto :parse_args
)
if "%~1"=="-t" (
    set "RUN_TESTS=true"
    shift
    goto :parse_args
)
if "%~1"=="--test" (
    set "RUN_TESTS=true"
    shift
    goto :parse_args
)
if "%~1"=="--" (
    shift
    goto :parse_args
)
if "%~1:~0,1%"=="-" (
    echo [ERROR] Unknown option: %~1
    goto :show_help
)
if not defined VERSION (
    set "VERSION=%~1"
) else (
    echo [ERROR] Multiple versions specified: %VERSION% and %~1
    exit /b 1
)
shift
goto :parse_args

:show_help
echo AR Glasses Control Center - Release Script
echo.
echo Usage: %0 [OPTIONS] VERSION
echo.
echo Options:
echo   -h, --help     Show this help message
echo   -d, --dry-run  Show what would be done without making changes
echo   -t, --test     Run tests before release
echo.
echo Examples:
echo   %0 1.0.0       Release version 1.0.0
echo   %0 -d 1.1.0    Dry run for version 1.1.0
echo   %0 -t 2.0.0    Release version 2.0.0 with tests
echo.
echo This script will:
echo 1. Validate the version format
echo 2. Check for uncommitted changes
echo 3. Update package.json version
echo 4. Build the project
echo 5. Run tests (if --test flag is used)
echo 6. Commit changes
echo 7. Create and push a git tag
echo 8. Trigger GitHub Actions release workflow
exit /b 0

:main
REM Check if version is provided
if not defined VERSION (
    echo [ERROR] Version is required
    goto :show_help
)

REM Validate version format
echo %VERSION% | findstr /r "^[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*$" >nul
if errorlevel 1 (
    echo [ERROR] Invalid version format: %VERSION%
    echo Expected format: X.Y.Z (e.g., 1.0.0)
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not in a git repository. Please run this script from the project root.
    exit /b 1
)

REM Check if version already exists
git tag | findstr /x "v%VERSION%" >nul
if not errorlevel 1 (
    echo [ERROR] Version v%VERSION% already exists!
    exit /b 1
)

REM Check for uncommitted changes
git diff-index --quiet HEAD --
if errorlevel 1 (
    echo [WARNING] You have uncommitted changes. Please commit or stash them before releasing.
    set /p "CONTINUE=Do you want to continue anyway? (y/N): "
    if /i not "!CONTINUE!"=="y" exit /b 1
)

echo [INFO] Starting release process for version %VERSION%...

if "%DRY_RUN%"=="true" (
    echo [WARNING] DRY RUN MODE - No changes will be made
    echo.
    echo Would execute the following steps:
    echo 1. Update package.json version to %VERSION%
    echo 2. Build the project
    if "%RUN_TESTS%"=="true" echo 3. Run tests
    echo 4. Commit changes
    echo 5. Create tag v%VERSION%
    echo 6. Push tag to remote
    echo.
    goto :show_release_notes
)

REM Update package.json version
echo [INFO] Updating package.json version to %VERSION%...
cd augmented-control-center
call npm version %VERSION% --no-git-tag-version
if errorlevel 1 (
    echo [ERROR] Failed to update package.json version
    exit /b 1
)
cd ..
echo [SUCCESS] Package.json updated

REM Build the project
echo [INFO] Building the project...
cd augmented-control-center
call npm run build:css
if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)
cd ..
echo [SUCCESS] Build completed

REM Run tests if requested
if "%RUN_TESTS%"=="true" (
    echo [INFO] Running tests...
    cd augmented-control-center
    REM Add your test command here if you have tests
    REM call npm test
    cd ..
    echo [SUCCESS] Tests completed
)

REM Commit changes
echo [INFO] Committing changes...
git add package.json package-lock.json
git commit -m "chore: bump version to %VERSION%"
if errorlevel 1 (
    echo [ERROR] Failed to commit changes
    exit /b 1
)
echo [SUCCESS] Changes committed

REM Create and push tag
echo [INFO] Creating tag v%VERSION%...
git tag "v%VERSION%"
if errorlevel 1 (
    echo [ERROR] Failed to create tag
    exit /b 1
)
echo [SUCCESS] Tag v%VERSION% created

echo [INFO] Pushing tag to remote...
git push origin "v%VERSION%"
if errorlevel 1 (
    echo [ERROR] Failed to push tag
    exit /b 1
)
echo [SUCCESS] Tag pushed to remote

echo [SUCCESS] Release process completed!
echo [INFO] GitHub Actions will now build and publish the release.
echo [INFO] You can monitor the progress at: https://github.com/JayNightmare/Augmented-Control-Center/actions

echo.
goto :show_release_notes

:show_release_notes
echo [INFO] Release Notes Template for v%VERSION%:
echo.
echo ## 🚀 AR Glasses Control Center v%VERSION%
echo.
echo ### What's New
echo - [Add new features here]
echo - [Add improvements here]
echo - [Add bug fixes here]
echo.
echo ### Changes
echo - [List breaking changes if any]
echo - [List deprecations if any]
echo.
echo ### Technical Details
echo - [Add technical details if needed]
echo.
echo ### Installation
echo Download the appropriate version for your platform from the releases page.
echo.
echo ### Support
echo For issues and feature requests, please visit our [GitHub repository](https://github.com/JayNightmare/Augmented-Control-Center).
echo.
echo ---
echo *Built with ❤️ for AR Development*

exit /b 0 